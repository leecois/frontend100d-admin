import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { ExportButton, FilterDropdown, List, useTable } from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import {
  getDefaultFilter,
  useExport,
  useGo,
  useNavigation,
  useTranslate,
} from '@refinedev/core';
import { Button, Input, InputNumber, Table, theme, Typography } from 'antd';
import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { PaginationTotal } from '../../components';
import type { IUser, IUserFilterVariables } from '../../interfaces';

export const CustomerList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();

  const { tableProps, filters, sorters } = useTable<
    IUser,
    HttpError,
    IUserFilterVariables
  >({
    filters: {
      initial: [
        {
          field: 'membername',
          operator: 'contains',
          value: '',
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: '_id',
          order: 'desc',
        },
      ],
    },
    syncWithLocation: true,
  });

  const { isLoading, triggerExport } = useExport<IUser>({
    sorters,
    filters,
    pageSize: 50,
    maxItemCount: 50,
    mapData: (item) => ({
      id: item._id,
      membername: item.membername,
      email: item.email,
      YOB: item.YOB,
      isAdmin: item.isAdmin,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }),
  });

  return (
    <List
      breadcrumb={false}
      headerProps={{
        extra: <ExportButton onClick={triggerExport} loading={isLoading} />,
      }}
    >
      <Table
        {...tableProps}
        rowKey="_id"
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="members" />
          ),
        }}
      >
        <Table.Column
          key="_id"
          dataIndex="_id"
          title="ID #"
          render={(value) => (
            <Typography.Text style={{ whiteSpace: 'nowrap' }}>
              #{value}
            </Typography.Text>
          )}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          defaultFilteredValue={getDefaultFilter('_id', filters, 'eq')}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <InputNumber
                addonBefore="#"
                style={{ width: '100%' }}
                placeholder={t('users.filter.id.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="membername"
          dataIndex="membername"
          title={t('users.fields.name')}
          defaultFilteredValue={getDefaultFilter(
            'membername',
            filters,
            'contains',
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                style={{ width: '100%' }}
                placeholder={t('users.filter.name.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="email"
          dataIndex="email"
          title={t('users.fields.email')}
          defaultFilteredValue={getDefaultFilter('email', filters, 'contains')}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                style={{ width: '100%' }}
                placeholder={t('users.filter.email.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="YOB"
          dataIndex="YOB"
          title={t('users.fields.yob')}
          defaultFilteredValue={getDefaultFilter('YOB', filters, 'eq')}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <InputNumber
                style={{ width: '100%' }}
                placeholder={t('users.filter.yob.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="isAdmin"
          dataIndex="isAdmin"
          title={t('users.fields.isAdmin')}
          render={(value) => (
            <Typography.Text>{value ? 'Admin' : 'User'}</Typography.Text>
          )}
        />
        <Table.Column<IUser>
          fixed="right"
          title={t('table.actions')}
          render={(_, record) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                return go({
                  to: `${showUrl('members', record._id)}`,
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
