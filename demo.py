import psycopg2

conn = psycopg2.connect(
    "dbname='postgres' user='postgres.rqnfjtmklxarkbaghfek' password='manav4541' host='aws-0-ap-southeast-1.pooler.supabase.com' port='5432'"
)

cursor = conn.cursor()
cursor.execute("SELECT NOW();")
print(cursor.fetchone())

cursor.close()
conn.close()
