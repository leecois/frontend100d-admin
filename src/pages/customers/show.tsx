import { useList, useNavigation, useShow } from '@refinedev/core';
import { Flex, Grid } from 'antd';

import {
  CustomerInfoList,
  CustomerInfoSummary,
  Drawer,
} from '../../components';
import { CustomerCommentHistory } from '../../components/customer/review-table';
import type { IComment, IUser } from '../../interfaces';

export const CustomerShow = () => {
  const { list } = useNavigation();
  const breakpoint = Grid.useBreakpoint();
  const { queryResult: userResult } = useShow<IUser>({
    resource: 'members',
  });

  const user = userResult?.data?.data;

  const { data: commentsData } = useList<IComment>({
    resource: 'comments',
    filters: [
      {
        field: 'author._id',
        operator: 'eq',
        value: user?._id,
      },
    ],
    queryOptions: {
      enabled: !!user?._id,
    },
  });

  const comments = commentsData?.data || [];

  return (
    <Drawer
      open
      onClose={() => {
        list('members');
      }}
      width={breakpoint.sm ? '736px' : '100%'}
    >
      <Flex
        vertical
        gap={32}
        style={{
          padding: '32px',
        }}
      >
        <CustomerInfoSummary customer={user} />
        <CustomerInfoList customer={user} />
        <CustomerCommentHistory comments={comments} />
      </Flex>
    </Drawer>
  );
};
