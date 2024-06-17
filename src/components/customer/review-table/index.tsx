import { Table } from 'antd';

import type { IComment } from '../../../interfaces';

type CustomerCommentHistoryProps = {
  comments: IComment[];
};

export const CustomerCommentHistory = ({
  comments,
}: CustomerCommentHistoryProps) => {
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
      title: 'Email',
      dataIndex: ['author', 'email'],
      key: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return <Table dataSource={comments} columns={columns} rowKey="_id" />;
};
