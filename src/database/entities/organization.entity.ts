import { Entity, Column, BeforeInsert } from "typeorm";
import { BaseEntity } from "./abstract.entity";
import { v4 as uuidV4 } from 'uuid';
import { GeneralStatus } from "./_enums";

@Entity({ name: "organizations" })
export class OrganizationEntity extends BaseEntity {
    constructor(data?: Partial<OrganizationEntity>) {
        super(data);
        Object.assign(this, data);
    }

    @BeforeInsert()
    generateOrgId() {
        this.orgId = `org_${uuidV4()}`;
    }

    @Column({
        name: "name",
        type: "varchar",
        unique: false,
        nullable: false,
        length: 50,
    })
    name: string;

    @Column({
        name: "org_id",
        type: "varchar",
        unique: false,
        nullable: false,
    })
    orgId: string;

    @Column({
        name: "domain",
        type: "varchar",
        unique: false,
        nullable: true,
        length: 150,
    })
    domain: string;

    @Column({ nullable: true })
    public logo: string;

    @Column({
        type: "enum",
        enum: GeneralStatus,
        nullable: false,
        default: GeneralStatus.Active,
    })
    status: GeneralStatus;

    @Column({
        type: "boolean",
        name: "domain_verified",
        nullable: false,
        default: false,
    })
    domainVerified: boolean;

    @Column({
        type: "varchar",
        name: "user_count",
        nullable: false,
        default: 0
    })
    userCount: number;

    @Column({
        type: "varchar",
        name: "application_count",
        nullable: false,
        default: 0
    })
    applicationCount: number;

    @Column({
        type: "boolean",
        name: "has_owner",
        nullable: false,
        default: false
    })
    hasOwner: boolean;

    @Column({
        type: "varchar",
        name: "has_owner_token",
        nullable: true,
        default: null
    })
    hasOwnerToken?: string;
}
