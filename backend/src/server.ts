import app from './app.ts';
import { dbConfig } from './config/database.ts';

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log('================================================================');
  console.log('  SIGIN-MIL - SISTEMA DE INVENTARIO TIC Y COMUNICACIONES MILITAR');
  console.log('================================================================');
  console.log(`[STATUS] Servidor Express activo en: http://${HOST}:${PORT}`);
  console.log(`[API PREFIX] Rutas activas en: http://${HOST}:${PORT}/api/v1`);
  console.log(`[DATABASE] Motor ORM Sequelize: ${dbConfig.dialect.toUpperCase()}`);
  console.log(`[DATABASE HOST] ${dbConfig.host}:${dbConfig.port} | BD: ${dbConfig.database}`);
  console.log(`[COMSEC] Clasificación Terminal: ${process.env.SECURITY_CLASSIFICATION_LEVEL || 'TOP_SECRET'}`);
  console.log('================================================================\n');
});

// Manejo seguro de señales de terminación de Docker
process.on('SIGINT', () => {
  console.log('[SHUTDOWN] Señal de terminación recibida. Cerrando servicios militares...');
  server.close(() => {
    console.log('[SHUTDOWN] Servidor cerrado con éxito.');
    process.exit(0);
  });
});
