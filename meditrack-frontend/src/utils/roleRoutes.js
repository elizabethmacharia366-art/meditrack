export const ROLE_HOME_PATHS = {
  admin: "/admin",
  doctor: "/doctor",
  nurse: "/nurse",
  technician: "/technician",
  patient: "/patient",
};

export const getRoleHomePath = (role) => ROLE_HOME_PATHS[role] || "/login";
