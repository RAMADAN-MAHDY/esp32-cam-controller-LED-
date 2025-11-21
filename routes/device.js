import express from 'express';
import DeviceState from '../models/DeviceState.js';

const router = express.Router();

// Long Polling: جلب الحالة الحالية
router.get('/status', async (req, res) => {
    try {
      const startTime = Date.now();
      const timeout = 10000; // 10 ثواني
      const pollInterval = 200; // كل 0.2 ثانية نتحقق من التغيير
  
      let lastKnownUpdatedAt = req.query.lastUpdated
        ? new Date(req.query.lastUpdated)
        : null;
  
      const checkForChange = async () => {
        const state = await DeviceState.findOne({}) || { led: 'off', camera: true, updatedAt: new Date() };
        
        // لو في تغيير
        if (!lastKnownUpdatedAt || state.updatedAt > lastKnownUpdatedAt) {
          return res.json(state);
        }
  
        // لو وصلنا للمهلة 10 ثواني
        if (Date.now() - startTime > timeout) {
          return res.json(state); // نرجع نفس الحالة بدون تغيير
        }
  
        // نعيد التحقق بعد pollInterval
        setTimeout(checkForChange, pollInterval);
      };
  
      checkForChange();
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'فشل في جلب الحالة' });
    }
  });

// تحديث LED
router.post('/led/:action', async (req, res) => {
  const action = req.params.action;

  console.log(action)
  if (!['on','off'].includes(action)) return res.status(400).json({ error: 'Action غير صالح' });
  try {
    const state = await DeviceState.findOneAndUpdate({}, { led: action, updatedAt: new Date() }, { new: true, upsert: true });
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: 'فشل تحديث LED' });
  }
});

// تشغيل/ايقاف الكاميرا
router.post('/camera/toggle', async (req, res) => {
  try {
    const state = await DeviceState.findOne({});
    const newCameraState = !state?.camera;
    const updated = await DeviceState.findOneAndUpdate({}, { camera: newCameraState, updatedAt: new Date() }, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'فشل تحديث الكاميرا' });
  }
});

export default router;
