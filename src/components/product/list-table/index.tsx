import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  FilterDropdown,
  getDefaultSortOrder,
  NumberField,
  useSelect,
  useTable,
} from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import {
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from '@refinedev/core';
import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Select,
  Table,
  theme,
  Typography,
} from 'antd';
import { useLocation } from 'react-router-dom';

import type { IBrand, IWatches } from '../../../interfaces';
import { PaginationTotal } from '../../paginationTotal';

export const ProductListTable = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IWatches, HttpError>({
    filters: {
      initial: [
        {
          field: 'watchDescription',
          operator: 'contains',
          value: '',
        },
        {
          field: 'watchName',
          operator: 'contains',
          value: '',
        },
        {
          field: 'brand',
          operator: 'in',
          value: [],
        },
      ],
    },
    syncWithLocation: true,
  });

  const { selectProps: brandSelectProps, queryResult: brandQueryResult } =
    useSelect<IBrand>({
      resource: 'brands',
      optionLabel: 'brandName',
      optionValue: '_id',
      defaultValue: getDefaultFilter('brand._id', filters, 'in'),
    });

  const brands = brandQueryResult?.data?.data || [];

  return (
    <Table
      {...tableProps}
      rowKey="_id"
      pagination={{
        ...tableProps.pagination,
        showSizeChanger: true,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="products" />
        ),
      }}
    >
      <Table.Column
        title={
          <Typography.Text
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            ID #
          </Typography.Text>
        }
        dataIndex="_id"
        key="_id"
        width={80}
        render={(value) => (
          <Typography.Text
            style={{
              whiteSpace: 'nowrap',
            }}
          >
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
              placeholder={t('products.filter.id.placeholder')}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        title={t('products.fields.imgUrl.label')}
        dataIndex="image"
        key="image"
        render={(image: string) => {
          return (
            <Avatar
              shape="square"
              src={image || 'default-image-url.jpg'}
              alt={`Product image`}
            />
          );
        }}
      />
      <Table.Column
        title={t('products.fields.name')}
        dataIndex="watchName"
        key="watchName"
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter(
          'watchName',
          filters,
          'contains',
        )}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t('products.filter.name.placeholder')} />
          </FilterDropdown>
        )}
        render={(value: string) => {
          return (
            <Typography.Text
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {value}
            </Typography.Text>
          );
        }}
      />
      <Table.Column
        title={t('products.fields.description')}
        dataIndex="watchDescription"
        key="watchDescription"
        width={432}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter(
          'watchDescription',
          filters,
          'contains',
        )}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t('products.filter.description.placeholder')} />
          </FilterDropdown>
        )}
        render={(description: string) => {
          return (
            <Typography.Paragraph
              ellipsis={{ rows: 1, tooltip: true }}
              style={{
                maxWidth: '400px',
                marginBottom: 0,
              }}
            >
              {description}
            </Typography.Paragraph>
          );
        }}
      />
      <Table.Column
        title={t('products.fields.price')}
        dataIndex="price"
        key="price"
        align="right"
        sorter
        defaultSortOrder={getDefaultSortOrder('price', sorters)}
        render={(price: number) => {
          return (
            <NumberField
              value={price}
              style={{
                width: '80px',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
              options={{
                style: 'currency',
                currency: 'USD',
              }}
            />
          );
        }}
      />
      <Table.Column<IWatches>
        title={t('products.fields.brand')}
        dataIndex={['brand', 'brandName']}
        key="brand"
        width={128}
        defaultFilteredValue={getDefaultFilter('brand._id', filters, 'in')}
        filterDropdown={(props) => {
          return (
            <FilterDropdown
              {...props}
              selectedKeys={props.selectedKeys.map(String)}
            >
              <Select
                {...brandSelectProps}
                style={{ width: '200px' }}
                allowClear
                mode="multiple"
                placeholder={t('products.filter.brand.placeholder')}
              />
            </FilterDropdown>
          );
        }}
        render={(_, record) => {
          const brandMatch = brands.find(
            (brandItem) => brandItem?._id === record.brand?._id,
          );

          return (
            <Typography.Text
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {brandMatch?.brandName || '-'}
            </Typography.Text>
          );
        }}
      />

      <Table.Column
        title={t('table.actions')}
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IWatches) => {
          return (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                return go({
                  to: `${showUrl('watches', record._id)}`,
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
          );
        }}
      />
    </Table>
  );
};
