import { toast } from 'react-toastify';
import { ui } from '@/lib/ui';

export const ask = (message, onConfirm) =>
  toast(
    ({ closeToast }) => (
      <div>
        <p className="mb-3 font-semibold">{message}</p>
        <div className="flex gap-2">
          <button
            className={ui.btn}
            onClick={() => {
              closeToast();
              onConfirm();
            }}
          >
            Yes
          </button>
          <button className={ui.ghost} onClick={closeToast}>
            Cancel
          </button>
        </div>
      </div>
    ),
    { autoClose: false, closeOnClick: false, draggable: false, icon: false }
  );
