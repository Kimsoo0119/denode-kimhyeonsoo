import { Entity, Column, ManyToOne, JoinColumn, Index, Check } from 'typeorm';
import { BaseEntity } from '@entities/base.entity';
import { Inventory } from '@entities/inventory.entity';
import { User } from '@entities/user.entity';

export enum InventoryTransactionType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('inventory_history')
@Check(`
  (type = 'IN' AND quantity > 0) OR 
  (type = 'OUT' AND quantity < 0)
`)
export class InventoryHistory extends BaseEntity {
  @Column()
  inventoryId: number;

  @Column()
  userId: number;

  @Column({ type: 'enum', enum: InventoryTransactionType })
  type: InventoryTransactionType;

  @Column()
  quantity: number;

  @Column({ length: 255, nullable: true })
  reason?: string;

  @ManyToOne(() => Inventory, (inventory) => inventory.histories)
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @ManyToOne(() => User, (user) => user.inventoryHistories)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
