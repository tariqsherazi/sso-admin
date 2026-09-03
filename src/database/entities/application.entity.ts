import { Entity, Column, BeforeInsert, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./abstract.entity";
import { OrganizationEntity } from "./organization.entity";
import { v4 as uuidV4 } from 'uuid';
import { GeneralStatus } from "./_enums";

@Entity({ name: "applications" })
export class ApplicationsEntity extends BaseEntity {
	constructor(data?: Partial<ApplicationsEntity>) {
		super(data);
		Object.assign(this, data);
	}

	@BeforeInsert()
	generateAppCredentials() {
		this.appSecret = `secret_${uuidV4()}`;
		this.appId = `app_${uuidV4()}`;

	}


	@Column({ nullable: true })
	public logo: string;

	@Column({
		name: "app_name",
		type: "varchar",
		unique: false,
		nullable: false,
		length: 50,
	})
	appName: string;

	@Column({
		name: "app_id",
		type: "varchar",
		unique: false,
		nullable: false,
	})
	appId: string;


	@Column({
		name: "app_secret",
		type: "varchar",
		unique: false,
		nullable: false,
	})
	appSecret: string;

	@Column({
		name: "url",
		type: "varchar",
		unique: false,
		nullable: true,
		length: 150,
	})
	url: string;

	@Column({
		type: "enum",
		enum: GeneralStatus,
		nullable: false,
		default: GeneralStatus.Active,
	})
	status: GeneralStatus;

	@Column({
		type: "simple-array",
		name: "redirect_uri",
		nullable: false,
	})
	redirectUri: string[];

	@ManyToOne(() => OrganizationEntity, (organization) => organization.id, { nullable: true })
	@JoinColumn({ name: "organization_id" })
	public organization: OrganizationEntity;


}
