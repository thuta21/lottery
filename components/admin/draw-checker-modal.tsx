import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDrawHistory, checkLotteryPrice, DrawListItem, PriceCheckResult } from '@/lib/lottery-api';
import { formatApiDateToEnglish, formatThaiCurrency } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface LotteryTicket {
  id: string;
  ticket_number: string;
}

interface DrawCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: LotteryTicket[];
  drawTitle: string;
}

export function DrawCheckerModal({ isOpen, onClose, tickets, drawTitle }: DrawCheckerModalProps) {
  const [historicalDraws, setHistoricalDraws] = useState<DrawListItem[]>([]);
  const [selectedDrawId, setSelectedDrawId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PriceCheckResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setSelectedDrawId(null);
      setResults(null);
      setError(null);

      const fetchHistory = async () => {
        const draws = await getDrawHistory(1);
        setHistoricalDraws(draws);
      };
      fetchHistory();
    }
  }, [isOpen]);

  const handleCheckPrices = async () => {
    if (!selectedDrawId || tickets.length === 0) {
      setError('Please select a draw and ensure there are tickets to check.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const checkPromises = tickets.map(ticket => 
        checkLotteryPrice(ticket.ticket_number, selectedDrawId)
      );
      const priceCheckResults = await Promise.all(checkPromises);
      setResults(priceCheckResults);
    } catch (err: any) { 
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const winningTickets = results?.filter(r => r.totalWinning > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Check Ticket Winnings for "{drawTitle}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-center">
            <Select onValueChange={setSelectedDrawId} value={selectedDrawId || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select a historical draw to check against" />
              </SelectTrigger>
              <SelectContent>
                {historicalDraws.map(draw => (
                  <SelectItem key={draw.id} value={draw.id}>
                    {formatApiDateToEnglish(draw.date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleCheckPrices} disabled={isLoading || !selectedDrawId}>
              {isLoading ? 'Checking...' : 'Check Winnings'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Check Results</h3>
              {winningTickets && winningTickets.length > 0 ? (
                <div className="max-h-[40vh] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket Number</TableHead>
                        <TableHead>Winning Prizes</TableHead>
                        <TableHead className="text-right">Total Reward</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {winningTickets.map(res => (
                        <TableRow key={res.number}>
                          <TableCell>{res.number}</TableCell>
                          <TableCell>
                            {res.prizes.map(p => p.name).join(', ')}
                          </TableCell>
                          <TableCell className="text-right">{formatThaiCurrency(res.totalWinning)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                 <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>No winning tickets found for this draw.</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
