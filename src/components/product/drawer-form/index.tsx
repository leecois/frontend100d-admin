import { SaveButton, useDrawerForm, useSelect } from '@refinedev/antd';
import type { BaseKey } from '@refinedev/core';
import { useGetToPath, useGo, useTranslate } from '@refinedev/core';
import {
  Avatar,
  Button,
  Checkbox,
  Flex,
  Form,
  Grid,
  Input,
  InputNumber,
  Select,
  Spin,
} from 'antd';
import { useSearchParams } from 'react-router-dom';

import type { IBrand, IWatches } from '../../../interfaces';
import { Drawer } from '../../drawer';
import { useStyles } from './styled';

type Props = {
  id?: BaseKey;
  action: 'create' | 'edit';
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const ProductDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const { styles } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IWatches>({
      resource: 'watches',
      id: props?.id,
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
      },
    });

  const { selectProps: brandSelectProps } = useSelect<IBrand>({
    resource: 'brands',
    optionLabel: 'brandName',
    optionValue: '_id',
  });

  const onDrawerClose = () => {
    close();

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

  const imageUrl = Form.useWatch('image', formProps.form);

  const title =
    props.action === 'edit'
      ? t('products.actions.edit')
      : t('products.actions.add');

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? '736px' : '100%'}
      zIndex={1001}
      onClose={onDrawerClose}
    >
      <Spin spinning={formLoading}>
        <Form
          {...formProps}
          layout="vertical"
          initialValues={formProps.initialValues}
        >
          <Form.Item
            label={t('products.fields.image')}
            name="image"
            className={styles.formItem}
            rules={[
              {
                required: true,
                message: t('products.errors.image.required'),
              },
              {
                type: 'url',
                message: t('products.errors.image.url'),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Flex vertical align="center" justify="center">
            <Avatar
              shape="square"
              style={{
                aspectRatio: 1,
                objectFit: 'contain',
                width: imageUrl ? '100%' : '48px',
                height: imageUrl ? '100%' : '48px',
                marginTop: imageUrl ? undefined : 'auto',
                transform: imageUrl ? undefined : 'translateY(50%)',
              }}
              src={imageUrl || '/images/product-default-img.png'}
              alt="Product Image"
            />
          </Flex>
          <Flex vertical>
            <Form.Item
              label={t('products.fields.watchName')}
              name="watchName"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                  message: t('products.errors.watchName.required'),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('products.fields.watchDescription')}
              name="watchDescription"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                  message: t('products.errors.watchDescription.required'),
                },
              ]}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
              label={t('products.fields.price')}
              name="price"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                  message: t('products.errors.price.required'),
                },
              ]}
            >
              <InputNumber prefix={'$'} style={{ width: '150px' }} />
            </Form.Item>
            <Form.Item
              label={t('products.fields.automatic')}
              name="automatic"
              valuePropName="checked"
              className={styles.formItem}
            >
              <Checkbox>{t('products.fields.automatic')}</Checkbox>
            </Form.Item>
            <Form.Item
              label={t('products.fields.brand')}
              name={['brand', '_id']}
              className={styles.formItem}
              rules={[
                {
                  required: true,
                  message: t('products.errors.brand.required'),
                },
              ]}
            >
              <Select {...brandSelectProps} />
            </Form.Item>
            <Flex
              align="center"
              justify="space-between"
              style={{
                padding: '16px 16px 0px 16px',
              }}
            >
              <Button onClick={onDrawerClose}>Cancel</Button>
              <SaveButton
                {...saveButtonProps}
                htmlType="submit"
                type="primary"
                icon={null}
              >
                Save
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
