import { database } from '.'
import type {
  Reservacion,
  ReservacionWithId,
  ReservacionWithIdClient,
} from '../models/Reservacion'

const reservacionesRef = database.ref('reservaciones')
export const getAllReservaciones = async (): Promise<
  ReservacionWithIdClient[]
> => {
  const snapshot = await reservacionesRef.once('value')
  const reservacionesMap = snapshot.val() as Record<
    string,
    Record<string, Reservacion>
  >
  const reservaciones: ReservacionWithIdClient[] = Object.keys(
    reservacionesMap
  ).map((mapKey) => {
    const mapValue = reservacionesMap[mapKey]
    const key = Object.keys(mapValue)[0]
    const value = mapValue[key]
    return { id: key, idCliente: mapKey, ...value }
  })
  return reservaciones
}

export const getReservacion = async (
  id: string
): Promise<ReservacionWithIdClient | undefined> => {
  const reservaciones = await getAllReservaciones()
  return reservaciones.find((reservaciones) => reservaciones.id === id)
}

export const getUserReservaciones = async (
  id: string
): Promise<ReservacionWithId[] | undefined> => {
  const snapshot = await reservacionesRef.child(`/${id}`).once('value')
  const reservacionesMap = snapshot.val() as Record<string, Reservacion>
  const reservaciones: ReservacionWithId[] = Object.keys(reservacionesMap).map(
    (mapKey) => {
      const mapValue = reservacionesMap[mapKey]
      return { id: mapKey, ...mapValue }
    }
  )
  return reservaciones
}

export const getLatestReservacion = async (
  id: string
): Promise<ReservacionWithId | undefined> => {
  const reservaciones = await getUserReservaciones(id)
  return reservaciones
    ?.map((rsv) => ({ ...rsv, fechaGenerado: new Date(rsv.fechaGenerado) }))
    .sort(
      (rsv1, rsv2) =>
        rsv2.fechaGenerado.getTime() - rsv1.fechaGenerado.getTime()
    )[0]
}
