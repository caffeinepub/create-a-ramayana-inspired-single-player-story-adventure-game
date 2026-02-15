import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ObjectiveProgress {
    missionId: bigint;
    objectives: Array<[string, boolean]>;
}
export interface UserProfile {
    name: string;
}
export interface Progress {
    completedObjectives: Array<ObjectiveProgress>;
    stateVariables: Array<[string, string]>;
    chapter: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    loadProgress(): Promise<Progress | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProgress(progress: Progress): Promise<void>;
}
