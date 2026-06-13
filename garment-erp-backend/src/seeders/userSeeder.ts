import bcrypt from 'bcryptjs';
import User, { IUserDocument } from '../models/User';

export const seedUsers = async (): Promise<IUserDocument[]> => {
  await User.deleteMany({});

  const users = [
    { name: 'Super Admin', email: 'admin@garmenterp.com', password: 'Admin@123', role: 'superAdmin', department: 'Management' },
    { name: 'Production Manager', email: 'production@garmenterp.com', password: 'Prod@123', role: 'productionManager', department: 'Production' },
    { name: 'Merchandiser', email: 'merchandiser@garmenterp.com', password: 'Merch@123', role: 'merchandiser', department: 'Merchandising' },
    { name: 'QC Inspector', email: 'qc@garmenterp.com', password: 'Qc@12345', role: 'qcInspector', department: 'Quality' },
    { name: 'Accounts Executive', email: 'accounts@garmenterp.com', password: 'Acc@1234', role: 'accounts', department: 'Finance' },
    { name: 'Viewer', email: 'viewer@garmenterp.com', password: 'View@123', role: 'viewer', department: 'General' },
  ] as const;

  const created: IUserDocument[] = [];
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const doc = await User.create({ name: u.name, email: u.email, passwordHash, role: u.role, department: u.department });
    created.push(doc);
  }

  console.log(`✅ Seeded ${created.length} users`);
  return created;
};
