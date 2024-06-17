import { CheckCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Tag, theme, Typography } from 'antd';
import React from 'react';

import type { IUser } from '../../../interfaces';

type Props = {
  value: IUser['isAdmin'];
};

export const UserStatus = ({ value }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();

  const statusText = value
    ? t('users.fields.status.isAdmin')
    : t('users.fields.status.notAdmin');
  const statusIcon = value ? <CheckCircleOutlined /> : <PauseCircleOutlined />;
  const statusColor = value ? 'green' : 'default';
  const textColor = value ? token.colorSuccess : token.colorTextTertiary;

  return (
    <Tag
      color={statusColor}
      style={{
        color: textColor,
      }}
      icon={statusIcon}
    >
      <Typography.Text
        style={{
          color: textColor,
        }}
      >
        {statusText}
      </Typography.Text>
    </Tag>
  );
};
