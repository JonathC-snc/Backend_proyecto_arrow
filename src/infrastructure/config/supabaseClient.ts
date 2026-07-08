import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Las credenciales de Supabase (SUPABASE_URL, SUPABASE_KEY) no están configuradas en el archivo .env');
}

/**
 * Cliente global de Supabase.
 * Esta configuración respeta Clean Architecture porque la conexión a la base de datos
 * se maneja exclusivamente en la capa de Infraestructura (Drivers).
 * El cliente será inyectado en los repositorios concretos.
 */
export const supabaseClient = createClient(supabaseUrl, supabaseKey);
