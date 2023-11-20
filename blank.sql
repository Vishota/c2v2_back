-- Adminer 4.8.1 PostgreSQL 16.1 (Debian 16.1-1.pgdg120+1) dump

DROP TABLE IF EXISTS "accounts";
DROP SEQUENCE IF EXISTS accounts_id_seq;
CREATE SEQUENCE accounts_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."accounts" (
    "id" integer DEFAULT nextval('accounts_id_seq') NOT NULL,
    "username" character varying(16) NOT NULL,
    "password_hash" character varying(60) NOT NULL,
    "access" boolean DEFAULT true NOT NULL,
    "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "accounts_username" UNIQUE ("username")
) WITH (oids = false);


DROP TABLE IF EXISTS "admins";
CREATE TABLE "public"."admins" (
    "user_id" integer NOT NULL,
    "is_prime" boolean DEFAULT false NOT NULL,
    CONSTRAINT "admins_user_id" UNIQUE ("user_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "content";
DROP SEQUENCE IF EXISTS content_id_seq;
CREATE SEQUENCE content_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."content" (
    "id" integer DEFAULT nextval('content_id_seq') NOT NULL,
    "owner_user_id" integer NOT NULL,
    "title" character varying(500) NOT NULL,
    "content" character varying(12000) NOT NULL,
    "accessible" boolean DEFAULT true NOT NULL,
    "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "refresh";
CREATE TABLE "public"."refresh" (
    "user_id" integer NOT NULL,
    "token" character varying(48) NOT NULL,
    "valid_until" timestamp DEFAULT '(CURRENT_TIMESTAMP + ''60 days'')' NOT NULL
) WITH (oids = false);


DROP TABLE IF EXISTS "teachers";
DROP SEQUENCE IF EXISTS teachers_user_id_seq;
CREATE SEQUENCE teachers_user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."teachers" (
    "user_id" integer DEFAULT nextval('teachers_user_id_seq') NOT NULL,
    "name" character varying(100) NOT NULL,
    "speciality" character varying(100) NOT NULL,
    "about" character varying(1000) NOT NULL,
    "since" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "is_active" boolean DEFAULT false NOT NULL,
    CONSTRAINT "teachers_pkey" PRIMARY KEY ("user_id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY (user_id) REFERENCES accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT DEFERRABLE;

ALTER TABLE ONLY "public"."content" ADD CONSTRAINT "content_owner_user_id_fkey" FOREIGN KEY (owner_user_id) REFERENCES teachers(user_id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT DEFERRABLE;

ALTER TABLE ONLY "public"."refresh" ADD CONSTRAINT "refresh_user_id_fkey" FOREIGN KEY (user_id) REFERENCES accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT DEFERRABLE;

ALTER TABLE ONLY "public"."teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT DEFERRABLE;

-- 2023-11-20 19:19:46.164314+00