import {
  ClockCircleOutlined,
  CommentOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useList } from '@refinedev/core';
import { Card, Col, Row, Statistic, Table, Typography } from 'antd';
import React from 'react';

import type { IBrand, IComment, IUser, IWatches } from '../../interfaces';

export const DashboardPage: React.FC = () => {
  const { data: userData } = useList<IUser>({ resource: 'members' });
  const { data: watchData } = useList<IWatches>({ resource: 'watches' });
  const { data: brandData } = useList<IBrand>({ resource: 'brands' });

  const totalMembers = userData?.total || 0;
  const totalWatches = watchData?.total || 0;
  const totalBrands = brandData?.total || 0;

  const comments: IComment[] = [];
  watchData?.data.forEach((watch) => {
    comments.push(...watch.comments);
  });
  comments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const latestComments = comments.slice(0, 5);

  const columns = [
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Author',
      dataIndex: ['author', 'membername'],
      key: 'author',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Dashboard</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Members"
              value={totalMembers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Watches"
              value={totalWatches}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Brands"
              value={totalBrands}
              prefix={<TagsOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Card
        title="New Comments"
        style={{ marginTop: 24 }}
        extra={<CommentOutlined />}
      >
        <Table
          dataSource={latestComments}
          columns={columns}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
};
