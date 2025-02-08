export const ISSUE_STATUSES = {
  OPEN: { id: 1, name: 'open' },
  IN_PROGRESS: { id: 2, name: 'in_progress' },
  CLOSED: { id: 3, name: 'closed' },
} as const;

export type StatusName =
  (typeof ISSUE_STATUSES)[keyof typeof ISSUE_STATUSES]['name'];

export const getStatusIdByName = (statusName: string): number => {
  const status = Object.values(ISSUE_STATUSES).find(
    (s) => s.name === statusName,
  );
  if (!status) {
    throw new Error(`Invalid status "${statusName}"`);
  }
  return status.id;
};

export const isValidStatus = (statusName: string): statusName is StatusName => {
  return Object.values(ISSUE_STATUSES).some((s) => s.name === statusName);
};
