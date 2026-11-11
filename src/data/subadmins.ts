import { SubAdmin } from '../types';

export const initialSubAdmins: SubAdmin[] = [
  {
    id: 'sa-01',
    name: 'Brian Tumusiime',
    email: 'brian.t@richardrentals.ug',
    roleTitle: 'Regional Compliance Lead',
    permissions: {
      approvals: true,
      payments: false,
      countries: true,
      support: true,
    },
    lastActive: '10 mins ago',
  },
  {
    id: 'sa-02',
    name: 'Amina Nalubega',
    email: 'amina.n@richardrentals.ug',
    roleTitle: 'Finance & MoMo Settlements Manager',
    permissions: {
      approvals: false,
      payments: true,
      countries: false,
      support: true,
    },
    lastActive: '1 hour ago',
  },
  {
    id: 'sa-03',
    name: 'Kofi Mensah',
    email: 'kofi.m@richardrentals.com',
    roleTitle: 'West Africa Expansion Director',
    permissions: {
      approvals: true,
      payments: false,
      countries: true,
      support: false,
    },
    lastActive: 'Yesterday',
  },
];
