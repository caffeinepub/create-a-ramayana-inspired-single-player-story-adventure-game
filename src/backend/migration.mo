import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldUserProfile = { name : Text };
  type OldObjectiveProgress = { missionId : Nat; objectives : [(Text, Bool)] };
  type OldProgress = {
    chapter : Nat;
    stateVariables : [(Text, Text)];
    completedObjectives : [OldObjectiveProgress];
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    progressMap : Map.Map<Principal, OldProgress>;
  };

  type NewUserProfile = {
    name : Text;
    characterId : Nat;
  };
  type NewObjectiveProgress = OldObjectiveProgress;
  type NewProgress = {
    chapter : Nat;
    stateVariables : [(Text, Text)];
    completedObjectives : [NewObjectiveProgress];
    characterId : Nat;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    progressMap : Map.Map<Principal, NewProgress>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_id, profile) { { profile with characterId = 0 } },
    );

    let newProgressMap = old.progressMap.map<Principal, OldProgress, NewProgress>(
      func(_id, progress) { { progress with characterId = 0 } },
    );

    {
      userProfiles = newUserProfiles;
      progressMap = newProgressMap;
    };
  };
};
