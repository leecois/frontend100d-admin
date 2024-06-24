import { EditOutlined } from '@ant-design/icons';
import { DeleteButton, NumberField } from '@refinedev/antd';
import type { BaseKey, HttpError } from '@refinedev/core';
import {
  useGetToPath,
  useGo,
  useNavigation,
  useShow,
  useTranslate,
} from '@refinedev/core';
import {
  Avatar,
  Button,
  Col,
  Divider,
  Flex,
  Grid,
  List,
  theme,
  Typography,
} from 'antd';
import { useSearchParams } from 'react-router-dom';

import type { IWatches } from '../../../interfaces';
import { Drawer } from '../../drawer';
import { ProductReviewTable } from '../review-table';

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const ProductDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<IWatches, HttpError>({
    resource: 'watches',
    id: props?.id,
  });
  const watch = queryResult.data?.data;
  const comments = watch?.comments || [];

  const handleDrawerClose = () => {
    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to:
        searchParameters.get('to') ??
        getToPath({
          action: 'list',
        }) ??
        '',
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
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
          src={watch?.image}
          alt={watch?.watchName}
        />
      </Flex>
      <Flex
        vertical
        style={{
          backgroundColor: token.colorBgContainer,
        }}
      >
        <Flex
          vertical
          style={{
            padding: '16px',
          }}
        >
          <Typography.Title level={5}>{watch?.watchName}</Typography.Title>
          <Typography.Text type="secondary">
            {watch?.watchDescription}
          </Typography.Text>
        </Flex>
        <Divider
          style={{
            margin: 0,
            padding: 0,
          }}
        />
        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">
                  {t('products.fields.price')}
                </Typography.Text>
              ),
              value: (
                <NumberField
                  value={watch?.price || 0}
                  options={{
                    style: 'currency',
                    currency: 'USD',
                  }}
                />
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t('products.fields.brand')}
                </Typography.Text>
              ),
              value: (
                <Typography.Text>{watch?.brand?.brandName}</Typography.Text>
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t('products.fields.automatic')}
                </Typography.Text>
              ),
              value: (
                <Typography.Text>
                  {watch?.automatic ? 'Yes' : 'No'}
                </Typography.Text>
              ),
            },
          ]}
          renderItem={(item) => {
            return (
              <List.Item>
                <List.Item.Meta
                  style={{
                    padding: '0 16px',
                  }}
                  avatar={item.label}
                  title={item.value}
                />
              </List.Item>
            );
          }}
        />
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: '16px 16px 16px 0',
        }}
      >
        <DeleteButton
          type="text"
          recordItemId={watch?._id}
          resource="watches"
          onSuccess={() => {
            handleDrawerClose();
          }}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              props.onEdit();
            } else {
              go({
                to: `${editUrl('watches', watch?._id || '')}`,
                query: {
                  to: '/watches',
                },
                options: {
                  keepQuery: true,
                },
                type: 'replace',
              });
            }
          }}
        >
          {t('actions.edit')}
        </Button>
      </Flex>
      <Col
        span={24}
        style={{
          marginTop: '5px',
        }}
      >
        <ProductReviewTable comments={comments} />
      </Col>
    </Drawer>
  );
};
