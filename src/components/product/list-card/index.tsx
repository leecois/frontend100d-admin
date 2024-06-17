import { EyeOutlined, TagOutlined } from '@ant-design/icons';
import { NumberField, useSimpleList } from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import { useGo, useList, useNavigation, useTranslate } from '@refinedev/core';
import {
  Card,
  Divider,
  Flex,
  List,
  Skeleton,
  Tag,
  theme,
  Typography,
} from 'antd';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import type { IBrand, IWatches } from '../../../interfaces';
import { PaginationTotal } from '../../paginationTotal';
import { useStyles } from './styled';

export const ProductListCard = () => {
  const { styles, cx } = useStyles();
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const {
    listProps: productListProps,
    filters,
    setFilters,
  } = useSimpleList<IWatches, HttpError>({
    pagination: {
      current: 1,
      pageSize: 12,
    },
    filters: {
      initial: [
        {
          field: 'brand._id',
          operator: 'in',
          value: [],
        },
      ],
    },
  });

  const { data: brandData, isLoading: brandIsLoading } = useList<
    IBrand,
    HttpError
  >({
    resource: 'brands',
    pagination: {
      mode: 'off',
    },
  });
  const brands = brandData?.data || [];

  const brandFilters = useMemo(() => {
    const foundFilter = filters.find((filterItem) => {
      if ('field' in filterItem) {
        return filterItem.field === 'brand';
      }

      return false;
    });

    const filterValues = foundFilter?.value?.map(String);

    return {
      operator: foundFilter?.operator || 'in',
      value: (filterValues || []) as Array<string>,
    };
  }, [filters]).value;

  const hasBrandFilter = brandFilters?.length > 0;

  const handleOnTagClick = (brandId: string) => {
    const newFilters = brandFilters;
    const hasCurrentFilter = newFilters.includes(brandId);
    if (hasCurrentFilter) {
      newFilters.splice(newFilters.indexOf(brandId), 1);
    } else {
      newFilters.push(brandId);
    }

    setFilters([
      {
        field: 'brand',
        operator: 'in',
        value: newFilters,
      },
    ]);
  };

  return (
    <>
      <Divider style={{ margin: '16px 0px' }} />
      <Flex
        wrap="nowrap"
        gap={12}
        style={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <Tag
          style={{ padding: '4px 10px 4px 10px', cursor: 'pointer' }}
          color={hasBrandFilter ? undefined : token.colorPrimary}
          icon={<TagOutlined />}
          onClick={() => {
            setFilters([
              {
                field: 'brand',
                operator: 'in',
                value: [],
              },
            ]);
          }}
        >
          {t('products.filter.allBrands')}
        </Tag>
        {!brandIsLoading &&
          brands.map((brand) => (
            <Tag
              key={brand._id}
              color={brandFilters?.includes(brand._id) ? 'orange' : undefined}
              style={{
                padding: '4px 10px 4px 10px',
                cursor: 'pointer',
              }}
              onClick={() => {
                handleOnTagClick(brand._id);
              }}
            >
              {brand.brandName}
            </Tag>
          ))}

        {brandIsLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <Skeleton.Button
              key={index}
              style={{
                width: '108px',
                height: '30px',
              }}
              active
            />
          ))}
      </Flex>
      <Divider style={{ margin: '16px 0px' }} />
      <List
        {...productListProps}
        pagination={{
          ...productListProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName={'watches'} />
          ),
        }}
        grid={{
          gutter: [16, 16],
          column: 4,
          xxl: 4,
          xl: 4,
          lg: 3,
          md: 2,
          sm: 1,
          xs: 1,
        }}
        renderItem={(item) => (
          <List.Item style={{ height: '100%' }}>
            <Card
              hoverable
              bordered={false}
              className={styles.card}
              styles={{
                body: {
                  padding: 16,
                },
                cover: {
                  position: 'relative',
                },
                actions: {
                  marginTop: 'auto',
                },
              }}
              cover={
                <>
                  <Tag
                    onClick={() => {
                      return go({
                        to: `${showUrl('watches', item._id)}`,
                        query: {
                          to: pathname,
                        },
                        options: {
                          keepQuery: true,
                        },
                        type: 'replace',
                      });
                    }}
                    className={cx(styles.viewButton, 'viewButton')}
                    icon={<EyeOutlined />}
                  >
                    View
                  </Tag>
                  <img
                    src={item.image || 'default-image-url.jpg'}
                    alt={`Watch image ${item._id}`}
                    style={{
                      aspectRatio: 288 / 160,
                      objectFit: 'cover',
                    }}
                  />
                </>
              }
              actions={[
                <Flex
                  key="actions"
                  justify="space-between"
                  style={{
                    padding: '0 16px',
                  }}
                >
                  <Typography.Text key="brand.title">
                    {item.brand?.brandName}
                  </Typography.Text>
                </Flex>,
              ]}
            >
              <Card.Meta
                title={
                  <Flex>
                    <Typography.Title
                      level={5}
                      ellipsis={{
                        rows: 1,
                        tooltip: item.watchName,
                      }}
                    >
                      {item.watchName}
                    </Typography.Title>

                    <NumberField
                      value={item.price}
                      style={{
                        paddingLeft: '8px',
                        marginLeft: 'auto',
                      }}
                      options={{
                        style: 'currency',
                        currency: 'USD',
                      }}
                    />
                  </Flex>
                }
                description={item.watchDescription}
              />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
