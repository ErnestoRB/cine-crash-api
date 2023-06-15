export interface Reservacion extends ReservacionBase {
  fechaReservacion: Date
  fechaGenerado: Date
}

export interface ReservacionBase {
  titulo: string
  idPelicula: number

  cliente: string
  boletos: number
}

export interface ReservacionWithId extends Reservacion {
  id: string
}

export interface ReservacionWithIdClient extends Reservacion {
  id: string
  idCliente: string
}
