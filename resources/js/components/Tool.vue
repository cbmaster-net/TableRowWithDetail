<template>
    <table
        v-if="resources.length > 0"
        class="table w-full"
        cellpadding="0"
        cellspacing="0"
        data-testid="resource-table"
    >
        <thead>
        <tr>
            <!-- Select Checkbox -->
            <th
                :class="{
            'w-16': shouldShowCheckboxes,
            'w-8': !shouldShowCheckboxes,
          }"
            >
                &nbsp;
            </th>

            <!-- Field Names -->
            <th v-for="field in fields" :class="`text-${field.textAlign}`">
                <sortable-icon
                    @sort="requestOrderByChange(field)"
                    :resource-name="resourceName"
                    :uri-key="field.sortableUriKey"
                    v-if="field.sortable"
                >
                    {{ field.indexName }}
                </sortable-icon>

                <span v-else>{{ field.indexName }}</span>
            </th>

            <!-- Actions, View, Edit, Delete -->
            <th>&nbsp;</th>
        </tr>
        </thead>
        <tbody>
        <template
            v-for="(resource, index) in resources">
<!--            @actionExecuted="$emit('actionExecuted')">-->
<!--            :testId="`${resourceName}-items-${index}`"-->
<!--            :key="resource.id.value"-->
<!--            :delete-resource="deleteResource"-->
<!--            :restore-resource="restoreResource"-->
<!--            :resource="resource"-->
<!--            :resource-name="resourceName"-->
<!--            :relationship-type="relationshipType"-->
<!--            :via-relationship="viaRelationship"-->
<!--            :via-resource="viaResource"-->
<!--            :via-resource-id="viaResourceId"-->
<!--            :via-many-to-many="viaManyToMany"-->
<!--            :checked="selectedResources.indexOf(resource) > -1"-->
<!--            :actions-are-available="actionsAreAvailable"-->
<!--            :should-show-checkboxes="shouldShowCheckboxes"-->
<!--            :update-selection-status="updateSelectionStatus"-->
<!--        >-->

<!--            props: [-->
<!--            'testId',-->
<!--            'deleteResource',-->
<!--            'restoreResource',-->
<!--            'resource',-->
<!--            'resourcesSelected',-->
<!--            'resourceName',-->
<!--            'relationshipType',-->
<!--            'viaRelationship',-->
<!--            'viaResource',-->
<!--            'viaResourceId',-->
<!--            'viaManyToMany',-->
<!--            'checked',-->
<!--            'actionsAreAvailable',-->
<!--            'shouldShowCheckboxes',-->
<!--            'updateSelectionStatus',-->
<!--            'queryString',-->
<!--            ],-->
            <template>{{availableActions(resource)}}</template>

            <tr :dusk="resource['id'].value  + '-row'">
                <!-- Resource Selection Checkbox -->
                <td
                    :class="{
        'w-16': shouldShowCheckboxes,
        'w-8': !shouldShowCheckboxes,
      }"
                >
                    <span>
                    <checkbox
                        :data-testid="`${resourceName}-items-${index}` + '-checkbox'"
                        :dusk="`${resource['id'].value}-checkbox`"
                        v-if="shouldShowCheckboxes"
                        :checked="selectedResources.indexOf(resource) > -1"
                        @input="toggleSelection"
                    />
                    <checkbox
                        @input="showDetailRow()"
                    />
                    </span>
                </td>

                <!-- Fields -->
                <td v-for="field in resource.fields">
                    <component
                        :is="'index-' + field.component"
                        :class="`text-${field.textAlign}`"
                        :resource-name="resourceName"
                        :via-resource="viaResource"
                        :via-resource-id="viaResourceId"
                        :field="field"
                    />
                </td>

                <td class="td-fit text-right pr-6 align-middle">
                    <div class="inline-flex items-center">
                        <!-- Actions Menu -->
                        <inline-action-selector
                            v-if="availableActions.length > 0"
                            class="mr-3"
                            :resource="resource"
                            :resource-name="resourceName"
                            :actions="availableActions"
                            @actionExecuted="$emit('actionExecuted')"
                        />

                        <!-- View Resource Link -->
                        <span v-if="resource.authorizedToView" class="inline-flex">
          <router-link
              :data-testid="`${resourceName}-items-${index}` + '-view-button'"
              :dusk="`${resource['id'].value}-view-button`"
              class="inline-flex cursor-pointer text-70 hover:text-primary mr-3"
              :to="{
              name: 'detail',
              params: {
                resourceName: resourceName,
                resourceId: resource['id'].value,
              },
            }"
              :title="__('View')"
          >
            <icon type="view" width="22" height="18" view-box="0 0 22 16" />
          </router-link>
        </span>

                        <span class="inline-flex" v-if="resource.authorizedToUpdate">
          <!-- Edit Pivot Button -->
          <router-link
              v-if="
              relationshipType == 'belongsToMany' ||
                relationshipType == 'morphToMany'
            "
              class="inline-flex cursor-pointer text-70 hover:text-primary mr-3"
              :dusk="`${resource['id'].value}-edit-attached-button`"
              :to="{
              name: 'edit-attached',
              params: {
                resourceName: viaResource,
                resourceId: viaResourceId,
                relatedResourceName: resourceName,
                relatedResourceId: resource['id'].value,
              },
              query: {
                viaRelationship: viaRelationship,
              },
            }"
              :title="__('Edit Attached')"
          >
            <icon type="edit" />
          </router-link>

                            <!-- Edit Resource Link -->
          <router-link
              v-else
              class="inline-flex cursor-pointer text-70 hover:text-primary mr-3"
              :dusk="`${resource['id'].value}-edit-button`"
              :to="{
              name: 'edit',
              params: {
                resourceName: resourceName,
                resourceId: resource['id'].value,
              },
              query: {
                viaResource: viaResource,
                viaResourceId: viaResourceId,
                viaRelationship: viaRelationship,
              },
            }"
              :title="__('Edit')"
          >
            <icon type="edit" />
          </router-link>
        </span>

                        <!-- Delete Resource Link -->
                        <button
                            :data-testid="`${resourceName}-items-${index}` + '-delete-button'"
                            :dusk="`${resource['id'].value}-delete-button`"
                            class="inline-flex appearance-none cursor-pointer text-70 hover:text-primary mr-3"
                            v-if="
            resource.authorizedToDelete &&
              (!resource.softDeleted || viaManyToMany)
          "
                            @click.prevent="openDeleteModal"
                            :title="__(viaManyToMany ? 'Detach' : 'Delete')"
                        >
                            <icon />
                        </button>

                        <!-- Restore Resource Link -->
                        <button
                            :dusk="`${resource['id'].value}-restore-button`"
                            class="inline-flex appearance-none cursor-pointer text-70 hover:text-primary mr-3"
                            v-if="
            resource.authorizedToRestore &&
              resource.softDeleted &&
              !viaManyToMany
          "
                            @click.prevent="openRestoreModal"
                            :title="__('Restore')"
                        >
                            <icon type="restore" with="20" height="21" />
                        </button>
                    </div>

                    <portal
                        to="modals"
                        transition="fade-transition"
                        v-if="deleteModalOpen || restoreModalOpen"
                    >
                        <delete-resource-modal
                            v-if="deleteModalOpen"
                            @confirm="confirmDelete"
                            @close="closeDeleteModal"
                            :mode="viaManyToMany ? 'detach' : 'delete'"
                        >
                            <div slot-scope="{ uppercaseMode, mode }" class="p-8">
                                <heading :level="2" class="mb-6">{{
                                    __(uppercaseMode + ' Resource')
                                    }}</heading>
                                <p class="text-80 leading-normal">
                                    {{ __('Are you sure you want to ' + mode + ' this resource?') }}
                                </p>
                            </div>
                        </delete-resource-modal>

                        <restore-resource-modal
                            v-if="restoreModalOpen"
                            @confirm="confirmRestore"
                            @close="closeRestoreModal"
                        >
                            <div class="p-8">
                                <heading :level="2" class="mb-6">{{
                                    __('Restore Resource')
                                    }}</heading>
                                <p class="text-80 leading-normal">
                                    {{ __('Are you sure you want to restore this resource?') }}
                                </p>
                            </div>
                        </restore-resource-modal>
                    </portal>
                </td>
            </tr>
            <tr
                class="hidden-visible-check"
                :dusk="resource['id'].value  + '-hidden-details-row'"
            >
                <div>
                    <detail-row/>
                    <p class="m-6">
                        Details:
                        ....<br>
                        ....<br>
                        ....<br>
                        ....<br>
                    </p>
                </div>
            </tr>
        </template>


        </tbody>
    </table>
</template>

<script>
    import { InteractsWithResourceInformation } from 'laravel-nova'
    // import DetailRow from "./DetailRow";

    export default {
        // components: {DetailRow},
        mixins: [InteractsWithResourceInformation],

        props: {
            authorizedToRelate: {
                type: Boolean,
                required: true,
            },
            resourceName: {
                default: null,
            },
            resources: {
                default: [],
            },
            singularName: {
                type: String,
                required: true,
            },
            selectedResources: {
                default: [],
            },
            selectedResourceIds: {},
            shouldShowCheckboxes: {
                type: Boolean,
                default: false,
            },
            actionsAreAvailable: {
                type: Boolean,
                default: false,
            },
            viaResource: {
                default: null,
            },
            viaResourceId: {
                default: null,
            },
            viaRelationship: {
                default: null,
            },
            relationshipType: {
                default: null,
            },
            updateSelectionStatus: {
                type: Function,
            },
        },

        data: () => ({
            selectAllResources: false,
            selectAllMatching: false,
            resourceCount: null,
            deleteModalOpen: false,
            restoreModalOpen: false,
            resource: null,
        }),

        methods: {
            /**
             * Delete the given resource.
             */
            deleteResource(resource) {
                this.$emit('delete', [resource])
            },

            /**
             * Restore the given resource.
             */
            restoreResource(resource) {
                this.$emit('restore', [resource])
            },

            /**
             * Broadcast that the ordering should be updated.
             */
            requestOrderByChange(field) {
                this.$emit('order', field)
            },


            /**
             * Select the resource in the parent component
             */
            toggleSelection() {
                this.updateSelectionStatus(this.resource)
            },

            openDeleteModal() {
                this.deleteModalOpen = true
            },

            confirmDelete() {
                this.deleteResource(this.resource)
                this.closeDeleteModal()
            },

            closeDeleteModal() {
                this.deleteModalOpen = false
            },

            openRestoreModal() {
                this.restoreModalOpen = true
            },

            confirmRestore() {
                this.restoreResource(this.resource)
                this.closeRestoreModal()
            },

            closeRestoreModal() {
                this.restoreModalOpen = false
            },

            availableActions(resource) {
                _.filter(resource.actions, a => a.showOnTableRow)
            },



        },

        computed: {
            /**
             * Get all of the available fields for the resources.
             */
            fields() {
                if (this.resources) {
                    return this.resources[0].fields
                }
            },

            /**
             * Determine if the current resource listing is via a many-to-many relationship.
             */
            viaManyToMany() {
                return (
                    this.relationshipType == 'belongsToMany' ||
                    this.relationshipType == 'morphToMany'
                )
            },

            /**
             * Determine if the current resource listing is via a has-one relationship.
             */
            viaHasOne() {
                return (
                    this.relationshipType == 'hasOne' || this.relationshipType == 'morphOne'
                )
            },


        },
    }
</script>
