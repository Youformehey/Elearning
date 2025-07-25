import type { EventObject, ExternalEventTypes, Options } from '@toast-ui/calendar';
import ToastUICalendar from '@toast-ui/calendar';
import React from 'react';
declare type ReactCalendarOptions = Omit<Options, 'defaultView'>;
declare type CalendarView = Required<Options>['defaultView'];
declare type CalendarExternalEventNames = Extract<keyof ExternalEventTypes, string>;
declare type ReactCalendarEventNames = `on${Capitalize<CalendarExternalEventNames>}`;
declare type ReactCalendarEventHandler = ExternalEventTypes[CalendarExternalEventNames];
declare type ReactCalendarExternalEvents = {
    [events in ReactCalendarEventNames]: ReactCalendarEventHandler;
};
declare type Props = ReactCalendarOptions & {
    height: string;
    events?: Partial<EventObject>[];
    view?: CalendarView;
} & ReactCalendarExternalEvents;
export default class ToastUIReactCalendar extends React.Component<Props> {
    containerElementRef: React.RefObject<HTMLDivElement>;
    calendarInstance: ToastUICalendar | null;
    static defaultProps: {
        height: string;
        view: string;
    };
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: Readonly<Props>): boolean;
    componentWillUnmount(): void;
    setCalendars(calendars?: Options['calendars']): void;
    setEvents(events?: Partial<EventObject>[]): void;
    bindEventHandlers(externalEvents: ReactCalendarExternalEvents): void;
    getInstance(): ToastUICalendar | null;
    getRootElement(): HTMLDivElement | null;
    render(): JSX.Element;
}
export {};
