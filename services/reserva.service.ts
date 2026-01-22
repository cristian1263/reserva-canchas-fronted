export async function createReservation(
  fieldId: number,
  date: string,
  startTime: string,
  duration: number,
  token: string
) {

    const start_time = `${date}T${startTime}:00`;

  const response = await fetch('http://localhost:8003/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      field_id: fieldId,
      start_time,
      duration_hours: duration,
      
    }),
  });

  console.log ('id', fieldId,'fecha y hora', start_time,'duracion', duration);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear la reserva');
  }

  return response.json();
}
