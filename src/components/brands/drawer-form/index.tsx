import { SaveButton, useDrawerForm } from '@refinedev/antd';
import type { BaseKey } from '@refinedev/core';
import { useGetToPath, useGo, useTranslate } from '@refinedev/core';
import { Button, Flex, Form, Grid, Input, Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';

import type { IBrand } from '../../../interfaces';
import { Drawer } from '../../drawer';
import { useStyles } from './styled';

type Props = {
  id?: BaseKey;
  action: 'create' | 'edit';
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const BrandDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const { styles } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IBrand>({
      resource: 'brands',
      id: props?.id,
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
      },
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

  const title =
    props.action === 'edit'
      ? t('brands.actions.edit')
      : t('brands.actions.add');

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
          initialValues={formProps.initialValues?.brand}
        >
          <Flex vertical>
            <Form.Item
              label={t('brands.fields.brandName')}
              name="brandName"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                  message: t('brands.errors.brandName.required'),
                },
              ]}
            >
              <Input />
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
