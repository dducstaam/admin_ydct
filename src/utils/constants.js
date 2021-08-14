export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const STATUS = [{
  label: 'Active',
  value: 'Y'
}, {
  label: 'Inactive',
  value: 'N'
}]

export const STATUS_OBJ = {
  Y: 'Active',
  N: 'Inactive'
}
