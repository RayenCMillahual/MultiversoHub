// src/utils/telemetry.ts

interface TelemetryEvent {
  timestamp: string;
  type: string;
  action: string;
  details?: any;
}

class Telemetry {
  private events: TelemetryEvent[] = [];
  private maxEvents: number = 100;

  log(type: string, action: string, details?: any) {
    const event: TelemetryEvent = {
      timestamp: new Date().toISOString(),
      type,
      action,
      details,
    };

    this.events.push(event);

    // Mantener solo los últimos N eventos
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Log en consola para desarrollo
    console.log(`[${type}]`, action, details || '');
  }

  getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  clearEvents() {
    this.events = [];
    console.log('[TELEMETRY] Events cleared');
  }

  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }
}

export const telemetry = new Telemetry();

// Funciones de conveniencia
export const logScreenView = (screenName: string) => {
  telemetry.log('NAVIGATION', 'screen_view', { screen: screenName });
};

export const logUserAction = (action: string, details?: any) => {
  telemetry.log('USER_ACTION', action, details);
};

export const logApiCall = (endpoint: string, success: boolean, details?: any) => {
  telemetry.log('API', success ? 'success' : 'error', { endpoint, ...details });
};

export const logError = (error: string, details?: any) => {
  telemetry.log('ERROR', error, details);
};