import env from '#start/env';
import { defineConfig, services } from '@adonisjs/drive';
import serviceAccount from '../firebase-admin-sdk.json' assert { type: "json" };

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  /**
   * The services object can be used to configure multiple file system
   * services each using the same or a different driver.
   */
  services: { 
    gcs: services.gcs({
      credentials: serviceAccount,
      bucket: env.get('GCS_BUCKET'),
      visibility: 'public',
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}