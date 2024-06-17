// BrandList.tsx
import { EyeOutlined } from '@ant-design/icons';
import { CreateButton, List, useTable } from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import { useGo, useNavigation, useTranslate } from '@refinedev/core';
import { Button, Table } from 'antd';
import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { PaginationTotal, TableBrandProductColumn } from '../../components';
import type { IBrand } from '../../interfaces';

export const BrandList = ({ children }: PropsWithChildren) => {
  const { tableProps } = useTable<IBrand, HttpError>();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const { createUrl } = useNavigation();
  const t = useTranslate();

  return (
    <List
      headerButtons={(props) => [
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl('brands')}`,
              query: {
                to: pathname,
              },
              options: {
                keepQuery: true,
              },
              type: 'replace',
            });
          }}
        >
          {t('brands.actions.add')}
        </CreateButton>,
      ]}
    >
      <Table
        {...tableProps}
        rowKey="_id"
        scroll={{
          x: true,
        }}
        pagination={{
          ...tableProps.pagination,
          hideOnSinglePage: true,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="brands" />
          ),
        }}
      >
        <Table.Column
          key="brandName"
          dataIndex="brandName"
          width={224}
          title={t('brands.fields.brandName')}
        />
        <Table.Column<IBrand>
          key="brandName"
          dataIndex="brandName"
          width={576}
          title={t('brands.fields.products')}
          render={(_, record) => {
            return <TableBrandProductColumn brand={record} />;
          }}
        />
        <Table.Column<IBrand>
          fixed="right"
          title={t('table.actions')}
          render={(_, record) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                return go({
                  to: `${showUrl('brands', record._id)}`,
                  query: {
                    to: pathname,
                  },
                  options: {
                    keepQuery: true,
                  },
                  type: 'replace',
                });
              }}
            />
          )}
        />
      </Table>
      {children}
    </List>
  );
};
