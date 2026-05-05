SELECT 'CREATE DATABASE portfolio OWNER ' || quote_ident(current_user)
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'portfolio')\gexec

SELECT 'CREATE DATABASE hype OWNER ' || quote_ident(current_user)
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hype')\gexec