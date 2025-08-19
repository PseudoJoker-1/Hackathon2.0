// все пути к API в одном месте, чтобы легко менять если что-то поменяется на сервере
export const ENDPOINTS = {
  LOGIN: '/api/token/',
  REGISTER: '/api/verify-register/',
  SEND_CODE: '/api/send-code/',
  REPORTS: '/api/reports/',
  USER_PROFILE: '/api/me/',
  REWARDS: '/rewards/',
  LEADERBOARD: '/leaderboard/',
}