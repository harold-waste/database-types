// @flow

import {
  sql
} from 'mightyql';
import type {
  DatabaseConnectionType,
  UnnormalizedColumnType
} from '../types';

export default async (connection: DatabaseConnectionType, schema: string): Promise<$ReadOnlyArray<UnnormalizedColumnType>> => {
  return connection.any(sql`
    SELECT
      col.table_name "tableName",
      col.column_name "columnName",
      col.is_nullable "isNullable",
      col.data_type "dataType",
      tco.constraint_type "constraintType",
      pgc."constraintDef",
      rc."refTableName",
      rc."refTableColumn"
FROM information_schema.columns col
left join (
    select kcu.table_schema,
       kcu.table_name,
       kcu.column_name,
       tco.constraint_type
	from information_schema.table_constraints tco
	join information_schema.key_column_usage kcu 
		 on kcu.constraint_name = tco.constraint_name
		 and kcu.constraint_schema = tco.constraint_schema
		 and kcu.constraint_name = tco.constraint_name
	where kcu.table_schema = ${schema} and (tco.constraint_type = 'PRIMARY KEY' or tco.constraint_type = 'FOREIGN KEY')
) as tco on tco.table_name = col.table_name and tco.column_name = col.column_name and tco.table_schema = col.table_schema
left join (
	select
		kcu1.table_schema as table_schema,
		kcu1.table_name as table_name,
		kcu1.column_name as column_name,
		kcu2.table_name as "refTableName",
		kcu2.column_name as "refTableColumn"
	from
		information_schema.referential_constraints as rc
	inner join information_schema.key_column_usage as kcu1 on
		kcu1.constraint_catalog = rc.constraint_catalog
		and kcu1.constraint_schema = rc.constraint_schema
		and kcu1.constraint_name = rc.constraint_name
	inner join information_schema.key_column_usage as kcu2 on
		kcu2.constraint_catalog = rc.unique_constraint_catalog
		and kcu2.constraint_schema = rc.unique_constraint_schema
		and kcu2.constraint_name = rc.unique_constraint_name
		and kcu2.ordinal_position = kcu1.ordinal_position
	where rc.constraint_schema = ${schema}
) as rc on rc.table_name = col.table_name and rc.column_name = col.column_name and rc.table_schema = col.table_schema
left join (
	select pgc.conname as constraint_name,
	       ccu.table_schema as table_schema,
	       ccu.table_name,
	       ccu.column_name,
	       pg_get_constraintdef(pgc.oid) as "constraintDef"
	from pg_constraint pgc
	join pg_namespace nsp on nsp.oid = pgc.connamespace
	join pg_class  cls on pgc.conrelid = cls.oid
	left join information_schema.constraint_column_usage ccu
      on pgc.conname = ccu.constraint_name
      and nsp.nspname = ccu.constraint_schema
    where pg_get_constraintdef(pgc.oid) like '%ARRAY%' and ccu.table_schema = ${schema}
) as pgc on pgc.table_name = col.table_name and pgc.column_name = col.column_name and pgc.table_schema = col.table_schema
WHERE col.table_schema = ${schema}
  `);
};
