# Database Backup Guide

## Overview

The backup script creates a full MySQL dump of the JM Comfort database using `mysqldump`. Backups are stored as timestamped `.sql` files in a configurable directory.

## Prerequisites

- `mysqldump` must be installed and available in the system PATH
- Valid database credentials in your `.env` file

## Configuration

The script uses the same database environment variables as the application:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_HOST` | Yes | — | Database host |
| `DB_PORT` | No | `3306` | Database port |
| `DB_NAME` | Yes | — | Database name |
| `DB_USER` | Yes | — | Database user |
| `DB_PASS` | Yes | — | Database password |
| `BACKUP_DIR` | No | `server/scripts/backups` | Backup output directory |
| `BACKUP_RETENTION_DAYS` | No | `30` | Days to keep old backups (0 = keep all) |

## Running Manually

From the project root:

```bash
node server/scripts/backup-database.js
```

Or from the `server/` directory:

```bash
npm run db:backup
```

## Scheduling Backups

### Linux/macOS (cron)

Edit crontab with `crontab -e` and add a line. Example for daily backup at 2:00 AM:

```
0 2 * * * cd /path/to/JM-Comfort && node server/scripts/backup-database.js >> /var/log/jm-backup.log 2>&1
```

### Windows (Task Scheduler)

1. Open Task Scheduler
2. Create Basic Task → name it "JM Comfort DB Backup"
3. Set trigger (e.g., Daily at 2:00 AM)
4. Action: Start a program
   - Program: `node`
   - Arguments: `server/scripts/backup-database.js`
   - Start in: `C:\path\to\JM-Comfort`

## Backup File Naming

Files are named: `{DB_NAME}_backup_{YYYY-MM-DD}_{HH-MM-SS}.sql`

Example: `jm_comfort_backup_2026-03-21_02-00-00-123.sql`

## Retention

Old backups are automatically deleted based on `BACKUP_RETENTION_DAYS`. Set to `0` to disable automatic cleanup.

## Verifying a Backup

To verify a backup file can be restored:

```bash
mysql -u root -p --execute="CREATE DATABASE jm_comfort_test;"
mysql -u root -p jm_comfort_test < server/scripts/backups/YOUR_BACKUP_FILE.sql
```

Then inspect the restored database and drop it when done:

```bash
mysql -u root -p --execute="DROP DATABASE jm_comfort_test;"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `mysqldump: command not found` | Install MySQL client tools or add MySQL bin directory to PATH |
| `Access denied` | Check `DB_USER` and `DB_PASS` in `.env` |
| `Unknown database` | Verify `DB_NAME` matches your actual database name |
| `Can't connect to MySQL server` | Verify `DB_HOST` and `DB_PORT`, check the database is running |
| Empty backup file | Check database permissions — user may lack SELECT/LOCK privileges |

## Testing the Script

1. Ensure `.env` has valid database credentials
2. Run `node server/scripts/backup-database.js`
3. Verify output shows "Backup completed successfully"
4. Check `server/scripts/backups/` for the new `.sql` file
5. Verify the file is non-empty and contains SQL statements
6. Test with invalid credentials to confirm error handling works
