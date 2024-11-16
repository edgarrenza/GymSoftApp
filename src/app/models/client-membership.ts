export interface ClientMembership {
    clientMembershipId: number;
    startDate:          Date;
    endDate:            Date;
    remainingDays:      number;
    quantity:           number;
    cost:               number;
    price:              number;
    enabled:            boolean;
    createdAt:          Date | null;
    updatedAt:          Date | null;
    clientId:           number;
    membershipId:       number;
}