import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

export class AppUtils {
    static DEFAULT_PAGE_LIMIT = 20;
    static async getEncryptedPassword(password: string) {
        const hashValue = await bcrypt.hash(password, 10);
        return hashValue;
    }

    static isEqualString(str1, str2) {
        return str1 && str2 && str1.toLowerCase() === str2.toLowerCase();
    }
    static isEmptyString(str: string) {
        return !str || str.trim() == '';
    }

    static getSortField(sort_field: string) {
        return AppUtils.isEmptyString(sort_field) ? 'created_at' : sort_field;
    }
    static getSortOrder(sort_order: string) {
        return AppUtils.isEmptyString(sort_order) ? 'desc' : sort_order;
    }
    static parseBool(value: string | boolean) {
        if (value === undefined || value === null) {
            return value;
        }
        return value === 'true' || value === true;
    }
    static getStartOfDay(dateInput) {
        return AppUtils.getUtcMoment(dateInput).startOf('day').format();
    }
    static getEndOfDay(dateInput) {
        return AppUtils.getUtcMoment(dateInput).endOf('day').format();
    }
    static getNextHour(dateInput) {
        return AppUtils.getUtcMoment(dateInput).add(1, 'hour').format();
    }
    static getLastFiveMinutesDelay(dateInput) {
        return AppUtils.getUtcMoment(dateInput).subtract(5, 'minute').unix();
    }

    static checkDateBelongsToday(dateInput) {
        const now = AppUtils.getUtcMoment();
        return AppUtils.getUtcMoment(dateInput).isBetween(now.startOf('day'), now.endOf('day'), 'm');
    }
    static getUtcMoment(dateInput = '') {
        return dateInput ? moment.utc(dateInput) : moment.utc();
    }

    static getIsoUtcMoment(dateInput = '') {
        const cMoment = dateInput ? moment.utc(dateInput) : moment.utc();
        return cMoment.format();
    }

    static getYesterdayMomentIso() {
        const cMoment = moment.utc();
        return cMoment.subtract(1, 'days').format();
    }

    static getIsoUtcMomentDate(dateInput: string | Date, format = null) {
        const cMoment = dateInput ? moment.utc(dateInput) : moment.utc();
        cMoment.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        return format ? cMoment.format(format) : cMoment.format();
    }
    static convertTextToKey(text: string) {
        // Convert string to lowercase and replace all spaces with _
        return text ? text.replace(/\s+/g, '_').toLowerCase() : text;
    }
    static cloneSimpleJson(json: any) {
        return JSON.parse(JSON.stringify(json));
    }

    static getS3WriteFilePath(fileType) {
        const date = new Date().toISOString().split('T')[0];
        const fileName = `system_data/${fileType}/${date}/${Date.now()}`;
        if (fileType == 'common_file_uploads') {
            const original_file_url = `${fileName}_file`;
            return { original_file_url };
        } else {
            const original_file_url = `${fileName}_original.xlsx`;
            const updated_file_url = `${fileName}_updated.xlsx`;
            const error_file_url = `${fileName}_errored.xlsx`;
            return { original_file_url, updated_file_url, error_file_url };
        }
    }

    static getS3WriteFilePathForInvoice(fileType, fileName = null) {
        const date = new Date().toISOString().split('T')[0];
        const filePrefix = `system_data/${fileType}/${date}/`;
        const file_path = fileName ? filePrefix + fileName : filePrefix + Date.now() + '_invoice';
        return { file_path };
    }

    static getTableId(strId: string): number {
        return parseInt(strId.split('_')[1], 10);
    }

    static async generateAndSendOtp(mobileNum: string): Promise<number> {
        // TODO: generate otp here and return it
        return 123456;
    }

    static convertMetersToKm(meters: number) {
        if (meters === 0) {
            return meters;
        }
        return parseFloat((meters / 1000).toFixed(2));
    }

    static getPaddedNumber = (val: string | number) => {
        const paddedStringLen = 5;
        const strVal = String(val);
        const numOfZeroesToPad = paddedStringLen - strVal.length;
        return strVal.padStart(numOfZeroesToPad, '0');
    };

    static checkIfStringPresentInArray(arr: string[], input: string) {
        arr = arr.map((arr) => arr.toLowerCase());
        return arr.indexOf(input.toLowerCase()) !== -1;
    }
}
