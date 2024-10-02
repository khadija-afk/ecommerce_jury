// logger.js
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, printf, colorize } = format;

// Définir le format des logs
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Configurer le logger
const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Ajout du timestamp
        logFormat  // Format sans colorisation
    ),
    transports: [
        new transports.Console({ format: combine(format.colorize(), logFormat) }),  // Console avec couleurs
        // Rotation des logs pour les logs généraux
        new DailyRotateFile({
            filename: 'logs/app-%DATE%.log', // Le fichier aura un suffixe avec la date
            datePattern: 'YYYY-MM-DD',  // Le fichier sera créé chaque jour
            maxSize: '20m',  // Taille maximale de chaque fichier de log (ici 20 MB)
            maxFiles: '14d',  // Garde les logs pendant 14 jours
            format: logFormat // Sans colorisation dans les fichiers
        }),

        // Rotation des logs pour les logs d'erreurs
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',  // Conserve les logs d'erreurs pendant 30 jours
            format: logFormat
        })
    ]
});

export default logger;
