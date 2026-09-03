import { Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./abstract.entity";
import { OrganizationEntity } from "./organization.entity";
import { UserAuthStatus } from "./_enums";

export abstract class BaseUser extends BaseEntity {
    constructor(data?: Partial<BaseUser>) {
        super(data);
        Object.assign(this, data);
    }

    @Column({ unique: true, nullable: false })
    public email: string;

    @Column({ unique: true, nullable: true })
    public username: string;

    @Column({ nullable: false })
    public password: string;

    @Column({ nullable: false, default: false })
    public emailVerified: boolean;

    @Column({
        type: "enum",
        enum: UserAuthStatus,
        nullable: false,
        default: UserAuthStatus.Active,
    })
    status: UserAuthStatus;

    @Column({ nullable: true })
    public firstName: string;

    @Column({ nullable: true })
    public lastName: string;

    @Column({ nullable: true })
    public phone: string;

    @ManyToOne(() => OrganizationEntity, (organization) => organization.id, { nullable: true })
    @JoinColumn({ name: "organization_id" })
    public organization: OrganizationEntity;

    @Column({ nullable: true })
    public timezone: string;

    @Column({ nullable: true })
    public profilePicture: string;

    @Column({ nullable: true })
    public emailConfirmationToken: string;

    @Column({
        type: "timestamp without time zone",
        nullable: true,
    })
    public emailTokenTime: Date;

    @Column({ nullable: true })
    public passwordRecoveryToken: string;

    @Column({
        type: "timestamp without time zone",
        nullable: true,
    })
    public recoveryTokenTime: Date;

    @Column({
        type: "timestamp without time zone",
        nullable: true,
    })
    public lastLoggedIn: Date;

}