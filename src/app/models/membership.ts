export interface Membership {
    membershipId: number,
    type: string,
    description: string,
    cost: number,
    enabled: boolean,
    createdAt: string,
    updatedAt: string
}

export type CreateMembership = Pick<Membership, 'type' | 'description' | 'description' >;
export type UpdateMembership = Pick<Membership, 'type' | 'description' | 'description' >;