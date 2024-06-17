import { EditOutlined } from '@ant-design/icons';
import { DeleteButton } from '@refinedev/antd';
import type { BaseKey, HttpError } from '@refinedev/core';
import { useGo, useNavigation, useShow, useTranslate } from '@refinedev/core';
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  List,
  theme,
  Typography,
} from 'antd';
import { useSearchParams } from 'react-router-dom';

import type { IBrand } from '../../../interfaces';
import { Drawer } from '../../drawer';

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const BrandDrawerShow = (props: Props) => {
  const [searchParameters] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<{ brand: IBrand }, HttpError>({
    resource: 'brands',
    id: props?.id,
  });
  const brand = queryResult.data?.data?.brand;

  const handleDrawerClose = () => {
    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to: searchParameters.get('to') ?? '/',
      query: { to: undefined },
      options: { keepQuery: true },
      type: 'replace',
    });
  };

  return (
    <Drawer
      open={true}
      width={breakpoint.sm ? '736px' : '100%'}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      <Flex vertical align="center" justify="center">
        <Avatar
          shape="square"
          style={{
            aspectRatio: 1,
            objectFit: 'contain',
            width: '240px',
            height: '240px',
            margin: '16px auto',
            borderRadius: '8px',
          }}
          src={`https://via.placeholder.com/240?text=${brand?.brandName}`}
          alt={brand?.brandName}
        />
      </Flex>
      <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
        <Flex vertical style={{ padding: '16px' }}>
          <Typography.Title level={5}>{brand?.brandName}</Typography.Title>
          <Typography.Text type="secondary">
            {t('brands.fields.createdAt')}:{' '}
            {brand?.createdAt ? new Date(brand.createdAt).toLocaleString() : ''}
          </Typography.Text>
          <Typography.Text type="secondary">
            {t('brands.fields.updatedAt')}:{' '}
            {brand?.updatedAt ? new Date(brand.updatedAt).toLocaleString() : ''}
          </Typography.Text>
        </Flex>
        <Divider style={{ margin: 0, padding: 0 }} />
        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">
                  {t('brands.fields._id')}
                </Typography.Text>
              ),
              value: <Typography.Text>{brand?._id}</Typography.Text>,
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                style={{ padding: '0 16px' }}
                avatar={item.label}
                title={item.value}
              />
            </List.Item>
          )}
        />
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        style={{ padding: '16px 16px 16px 0' }}
      >
        <DeleteButton
          type="text"
          recordItemId={brand?._id}
          resource="brands"
          onSuccess={() => handleDrawerClose()}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              props.onEdit();
            } else {
              go({
                to: `${editUrl('brands', brand?._id || '')}`,
                query: { to: '/brands' },
                options: { keepQuery: true },
                type: 'replace',
              });
            }
          }}
        >
          {t('actions.edit')}
        </Button>
      </Flex>
    </Drawer>
  );
};
