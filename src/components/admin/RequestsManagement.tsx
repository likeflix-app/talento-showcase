import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Phone, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { requestService } from '@/services/request';
import { Request } from '@/types/request';

const RequestsManagement: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const allRequests = await requestService.getAllRequests();
      setRequests(allRequests);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile caricare le richieste.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: Request['status']) => {
    try {
      await requestService.updateRequestStatus(requestId, newStatus);
      await loadRequests();
      toast({
        title: "Stato aggiornato",
        description: `La richiesta #${requestId} è stata aggiornata a ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato della richiesta.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Request['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, text: 'In Attesa' },
      confirmed: { variant: 'default' as const, icon: CheckCircle, text: 'Confermata' },
      completed: { variant: 'default' as const, icon: CheckCircle, text: 'Completata' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, text: 'Annullata' },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestione Richieste</CardTitle>
          <CardDescription>Caricamento richieste...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Gestione Richieste
              </CardTitle>
              <CardDescription>
                Gestisci tutte le richieste di talenti e le prenotazioni
              </CardDescription>
            </div>
            <Button onClick={loadRequests} variant="outline" size="sm">
              Aggiorna
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nessuna richiesta trovata</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Richiesta</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Talenti</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>Orario Prenotato</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Data Creazione</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">
                        {request.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Cliente #{request.userId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {request.talents.slice(0, 2).map((talent, index) => (
                            <div key={index} className="text-sm">
                              {talent.name} ({talent.category})
                            </div>
                          ))}
                          {request.talents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{request.talents.length - 2} altri
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.phoneNumber ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{request.phoneNumber}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Non fornito</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.timeSlot ? (
                          <div className="text-sm">
                            <div className="font-medium">{request.timeSlot.date}</div>
                            <div className="text-muted-foreground">{request.timeSlot.time}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Non prenotato</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(request.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog open={isDialogOpen && selectedRequest?.id === request.id} onOpenChange={(open) => {
                            if (open) {
                              setSelectedRequest(request);
                              setIsDialogOpen(true);
                            } else {
                              setIsDialogOpen(false);
                              setSelectedRequest(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Dettagli Richiesta #{request.id}</DialogTitle>
                                <DialogDescription>
                                  Visualizza tutti i dettagli della richiesta
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Cliente</label>
                                    <p className="text-sm text-muted-foreground">ID: {request.userId}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Stato</label>
                                    <div className="mt-1">
                                      {getStatusBadge(request.status)}
                                    </div>
                                  </div>
                                </div>
                                
                                {request.phoneNumber && (
                                  <div>
                                    <label className="text-sm font-medium">Telefono</label>
                                    <p className="text-sm text-muted-foreground">{request.phoneNumber}</p>
                                  </div>
                                )}

                                {request.timeSlot && (
                                  <div>
                                    <label className="text-sm font-medium">Orario Prenotato</label>
                                    <p className="text-sm text-muted-foreground">
                                      {request.timeSlot.date} alle {request.timeSlot.time}
                                    </p>
                                  </div>
                                )}

                                <div>
                                  <label className="text-sm font-medium">Talenti Richiesti</label>
                                  <div className="mt-2 space-y-2">
                                    {request.talents.map((talent, index) => (
                                      <div key={index} className="flex items-center gap-3 p-2 border rounded">
                                        <img
                                          src={talent.image}
                                          alt={talent.name}
                                          className="w-12 h-12 object-cover rounded"
                                        />
                                        <div>
                                          <p className="font-medium">{talent.name}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {talent.category} - {talent.price}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Aggiorna Stato</label>
                                  <Select
                                    value={request.status}
                                    onValueChange={(value: Request['status']) => 
                                      handleStatusChange(request.id, value)
                                    }
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">In Attesa</SelectItem>
                                      <SelectItem value="confirmed">Confermata</SelectItem>
                                      <SelectItem value="completed">Completata</SelectItem>
                                      <SelectItem value="cancelled">Annullata</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <label className="font-medium">Creata il</label>
                                    <p className="text-muted-foreground">{formatDate(request.createdAt)}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Ultimo aggiornamento</label>
                                    <p className="text-muted-foreground">{formatDate(request.updatedAt)}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsManagement;
