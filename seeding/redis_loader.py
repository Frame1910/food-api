import csv
from pkg_resources import require
import redis
import json


def parseCsvFile(file_name):
    table = []
    required_headers = 22
    with open(file_name, encoding='utf-8-sig') as csv_file:
        csv_reader = csv.reader(csv_file, dialect='excel')
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                headers = []
                for index, column_name in enumerate(row):
                    if index > required_headers:
                        break
                    headers.append(column_name.lower().replace(' ', '_').replace(
                        '(', '').replace(')', '').replace(',', '').replace(':', '_'))
            else:
                temp_dict = {}
                for index, column in enumerate(row):
                    if index > required_headers:
                        break
                    temp_dict[headers[index]] = column
                table.append(temp_dict)

            line_count += 1
    print(f'Parsed {line_count} lines into a table.')
    return table


redis_host = 'localhost'
redis_port = '6379'
try:
    r = redis.Redis(host=redis_host, port=redis_port)
    print('Connected.')
except:
    print('Failed to establish a connection to redis cloud.')

foods_table = parseCsvFile('foods.csv')
nutrients_table = parseCsvFile('nutrients.csv')

count = 0
end = 50

for index, row in enumerate(foods_table):
    # if count == end:
    #     break
    r.json().set(f'foods:{index}', '$', row)
    print(count)
    count += 1

print(f'Added {count} food record(s).')

count = 0
for index, row in enumerate(nutrients_table):
    # if count == end:
    #     break
    r.json().set(f'nutrients:{index}', '$', row)
    print(count)
    count += 1

print(f'Added {count} nutrient record(s).')

print('Database seeded.')
