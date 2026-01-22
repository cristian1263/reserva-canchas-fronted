import { Field } from '@/types';

const API_URL = 'http://localhost:8002/fields';

type FieldsResponse = {
  fields: Field[];
};

export async function getFields(token?: string): Promise<Field[]> {
  const response = await fetch(API_URL, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  if (!response.ok) {
    throw new Error('Error al obtener las canchas');
  }

  const data: FieldsResponse = await response.json();
  return data.fields;
}

export async function getAvailability(
  fieldId: number,
  date: string,
  token: string
): Promise<string[]> {
  const response = await fetch(
    `http://localhost:8002/fields/${fieldId}/availability?date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error obteniendo disponibilidad');
  }

  const data = await response.json();
  return data.available_slots || [];
}

