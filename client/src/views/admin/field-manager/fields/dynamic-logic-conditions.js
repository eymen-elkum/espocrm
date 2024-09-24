/************************************************************************
 * This file is part of EspoCRM.
 *
 * EspoCRM – Open Source CRM application.
 * Copyright (C) 2014-2024 Yurii Kuznietsov, Taras Machyshyn, Oleksii Avramenko
 * Website: https://www.espocrm.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/

import BaseFieldView from 'views/fields/base';

export default class extends BaseFieldView {

    detailTemplate = 'admin/field-manager/fields/dynamic-logic-conditions/detail'
    editTemplate = 'admin/field-manager/fields/dynamic-logic-conditions/edit'

    setup() {
        this.addActionHandler('editConditions', () => this.edit());

        this.conditionGroup = Espo.Utils.cloneDeep((this.model.get(this.name) || {}).conditionGroup || []);

        this.scope = this.params.scope || this.options.scope;

        this.createStringView();
    }

    createStringView() {
        this.createView('conditionGroup', 'views/admin/dynamic-logic/conditions-string/group-base', {
            selector: '.top-group-string-container',
            itemData: {
                value: this.conditionGroup
            },
            operator: 'and',
            scope: this.scope,
        }, view => {
            if (this.isRendered()) {
                view.render();
            }
        });
    }

    edit() {
        this.createView('modal', 'views/admin/dynamic-logic/modals/edit', {
            conditionGroup: this.conditionGroup,
            scope: this.scope,
        }, view => {
            view.render();

            this.listenTo(view, 'apply', conditionGroup => {
                this.conditionGroup = conditionGroup;

                this.trigger('change');

                this.createStringView();
            });
        });
    }

    fetch() {
        const data = {};

        data[this.name] = {
            conditionGroup: this.conditionGroup,
        };

        if (this.conditionGroup.length === 0) {
            data[this.name] = null;
        }

        return data;
    }
}
