import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import ApiService from '../common/apiService';
import * as telemetryActions from './telemetryActions';

export const loadDeviceSuccess = devices => {
  return {
    type: types.LOAD_DEVICES_SUCCESS,
    devices
  };
};

export const loadDeviceGroupSuccess = deviceGroup => {
  return {
    type: types.LOAD_DEVICES_GROUP_SUCCESS,
    deviceGroup
  };
};

export const loadDevicesByTelemetryMessages = () => {
  return dispatch => {
    return ApiService.getAllDevices()
      .then(data => {
        dispatch(loadDeviceSuccess(data));
        if (data && data.items) {
          const deviceIds = data.items.map(device => device.Id);
          dispatch(
            telemetryActions.loadTelemetryMessagesByDeviceIds(deviceIds)
          );
        }
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const loadDevices = () => {
  return dispatch => {
    return ApiService.getAllDevices()
      .then(data => {
        dispatch(loadDeviceSuccess(data));
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const loadDeviceGroup = () => {
  return dispatch => {
    return ApiService.getDeviceGroup()
      .then(devices => {
        dispatch(loadDeviceGroupSuccess(devices));
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};
