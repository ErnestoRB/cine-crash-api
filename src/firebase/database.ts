import { database } from '.'
import type {
  Reservacion,
  ReservacionWithId,
  ReservacionWithIdClient,
} from '../models/Reservacion'
import moment from 'moment-timezone'
import type { UserDetails } from '../models/User'

const reservacionesRef = database.ref('reservaciones')
const usersRef = database.ref('users')
const notificationsRef = database.ref('notifications')

export const getAllReservaciones = async (): Promise<
  ReservacionWithIdClient[]
> => {
  const snapshot = await reservacionesRef.once('value')
  const reservacionesMap = snapshot.val() as Record<
    string, // id cliente
    Record<string /* id reservacion */, Reservacion> // reservacion
  >
  const reservaciones: ReservacionWithIdClient[] = Object.keys(
    reservacionesMap
  ).flatMap((idCliente) => {
    const reservaciones = reservacionesMap[idCliente]
    const reservacionesKeys = Object.keys(reservaciones)
    return reservacionesKeys.map((reservacionKey) => ({
      id: reservacionKey,
      idCliente,
      ...reservaciones[reservacionKey],
    }))
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

export const isAnyReservacionOnDate = async (date: Date): Promise<boolean> => {
  if (!(date instanceof Date)) {
    throw new Error('No se proporcionó una fecha')
  }
  const reservaciones = await getAllReservaciones()
  return reservaciones
    .map((rsv) => ({
      ...rsv,
      fechaReservacion: new Date(rsv.fechaReservacion),
    }))
    .some(
      (rsv) =>
        rsv.fechaReservacion.getUTCFullYear() === date.getUTCFullYear() &&
        rsv.fechaReservacion.getUTCMonth() === date.getUTCMonth() &&
        rsv.fechaReservacion.getUTCDate() === date.getUTCDate() &&
        rsv.fechaReservacion.getUTCHours() === date.getUTCHours() &&
        rsv.fechaReservacion.getUTCMinutes() === date.getUTCMinutes()
    )
}

const timeZone = 'America/Mexico_City'
const format = 'YYYY/MM/DD'

export const getReservacionesOnDate = async (
  date: string
): Promise<ReservacionWithId[]> => {
  const wantedMoment = moment.utc(date).tz(timeZone)
  const reservaciones = await getAllReservaciones()
  return reservaciones.filter((rsv) => {
    const rsvMoment = moment.utc(rsv.fechaReservacion).tz(timeZone)
    return wantedMoment.format(format) === rsvMoment.format(format)
  })
}

export const isPhoneRegistered = async (phone: string): Promise<boolean> => {
  const snapshot = await usersRef.once('value')
  const list = snapshot.val() as Record<string, UserDetails>
  return Object.values(list).some((user) => user.number === phone)
}

export const getUserDetails = async (
  id: string
): Promise<UserDetails | undefined> => {
  const snapshot = await usersRef.once('value')
  const list = snapshot.val() as Record<string, UserDetails>
  const userDetails = list[id] as UserDetails | undefined
  return userDetails
}

export const canSendNotification = async (
  reservacionId: string
): Promise<boolean> => {
  const ref = notificationsRef.child(`/${reservacionId}`)
  const veces = (await ref.get()).val() as number | null
  return veces == null ? true : veces < 3
}

export const addNotification = async (reservacionId: string): Promise<void> => {
  const ref = notificationsRef.child(`/${reservacionId}`)
  const veces = (await ref.get()).val() as number | null
  await ref.set(veces == null ? 1 : veces)
}
