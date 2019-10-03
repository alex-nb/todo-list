import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';

const Alert = ({ alerts }) =>
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => (
        <Snackbar  key={alert.id}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            open={true}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{alert.msg}</span>}
      />
    ));
const mapStateToProps = ({ alert }) => ({
    alerts: alert
});

export default connect(mapStateToProps)(Alert);