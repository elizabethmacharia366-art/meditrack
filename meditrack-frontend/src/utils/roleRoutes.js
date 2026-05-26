export const ROLE_HOME_PATHS = {
  admin: "/admin",
  doctor: "/doctor",
  patient: "/patient",
};

export const getRoleHomePath = (role) => ROLE_HOME_PATHS[role] || "/login";
